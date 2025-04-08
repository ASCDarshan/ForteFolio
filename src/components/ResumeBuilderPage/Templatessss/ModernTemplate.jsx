import React from "react";
import {
    Typography,
    Box,
    Grid,
    Link,
    Stack,
    IconButton,
    Chip,
} from "@mui/material";
import { LocationOn as LocationIcon } from "@mui/icons-material";
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon,
    Language as LanguageIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
} from "@mui/icons-material";

const ModernTemplate = ({
    fontFamily,
    colorScheme,
    personalInfo,
    education,
    experience,
    skills,
    projects,
    toggleStarSection,
    starredSections,
    isSectionEmpty,
    formatDate,
}) => {
    return (
        <Box
            sx={{
                fontFamily: fontFamily,
                color: colorScheme.text,
                bgcolor: colorScheme.background,
                p: 4,
                maxWidth: "1000px",
                mx: "auto",
            }}
        >
            <Box
                sx={{
                    textAlign: "center",
                    mb: 4,
                    pb: 4,
                    borderBottom: "2px solid",
                    borderColor: colorScheme.primary,
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        color: colorScheme.primary,
                        mb: 1,
                        fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                >
                    {personalInfo.fullName || "Your Name"}
                </Typography>

                {personalInfo.jobTitle && (
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        gutterBottom
                        sx={{
                            fontWeight: 400,
                            fontSize: { xs: "1.2rem", md: "1.5rem" },
                            mb: 2,
                        }}
                    >
                        {personalInfo.jobTitle}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 3,
                        mt: 3,
                    }}
                >
                    {personalInfo.email && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <EmailIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: colorScheme.primary }}
                            />
                            <Typography variant="body2">{personalInfo.email}</Typography>
                        </Box>
                    )}

                    {personalInfo.phone && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PhoneIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: colorScheme.primary }}
                            />
                            <Typography variant="body2">{personalInfo.phone}</Typography>
                        </Box>
                    )}

                    {personalInfo.location && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocationIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: colorScheme.primary }}
                            />
                            <Typography variant="body2">{personalInfo.location}</Typography>
                        </Box>
                    )}

                    {personalInfo.linkedin && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LinkedInIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: colorScheme.primary }}
                            />
                            <Link
                                href={personalInfo.linkedin}
                                target="_blank"
                                variant="body2"
                                underline="hover"
                            >
                                LinkedIn
                            </Link>
                        </Box>
                    )}

                    {personalInfo.github && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <GitHubIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: colorScheme.primary }}
                            />
                            <Link
                                href={personalInfo.github}
                                target="_blank"
                                variant="body2"
                                underline="hover"
                            >
                                GitHub
                            </Link>
                        </Box>
                    )}

                    {personalInfo.website && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LanguageIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: colorScheme.primary }}
                            />
                            <Link
                                href={personalInfo.website}
                                target="_blank"
                                variant="body2"
                                underline="hover"
                            >
                                Website
                            </Link>
                        </Box>
                    )}

                    {personalInfo.portfolio && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LanguageIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: colorScheme.primary }}
                            />
                            <Link
                                href={personalInfo.portfolio}
                                target="_blank"
                                variant="body2"
                                underline="hover"
                            >
                                Portfolio
                            </Link>
                        </Box>
                    )}
                </Box>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
                    {personalInfo.summary && (
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontWeight: 600,
                                        color: colorScheme.primary,
                                        display: "flex",
                                        alignItems: "center",
                                        "&::after": {
                                            content: '""',
                                            flexGrow: 1,
                                            height: "2px",
                                            bgcolor: colorScheme.accent,
                                            ml: 2,
                                        },
                                    }}
                                >
                                    Profile
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => toggleStarSection("summary")}
                                    sx={{ ml: 1 }}
                                >
                                    {starredSections.includes("summary") ? (
                                        <StarIcon
                                            fontSize="small"
                                            sx={{ color: colorScheme.primary }}
                                        />
                                    ) : (
                                        <StarBorderIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </Box>
                            <Typography variant="body1" sx={{ textAlign: "justify" }}>
                                {personalInfo.summary}
                            </Typography>
                        </Box>
                    )}
                    {!isSectionEmpty("experience") && (
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontWeight: 600,
                                        color: colorScheme.primary,
                                        display: "flex",
                                        alignItems: "center",
                                        "&::after": {
                                            content: '""',
                                            flexGrow: 1,
                                            height: "2px",
                                            bgcolor: colorScheme.accent,
                                            ml: 2,
                                        },
                                    }}
                                >
                                    Experience
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => toggleStarSection("experience")}
                                    sx={{ ml: 1 }}
                                >
                                    {starredSections.includes("experience") ? (
                                        <StarIcon
                                            fontSize="small"
                                            sx={{ color: colorScheme.primary }}
                                        />
                                    ) : (
                                        <StarBorderIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </Box>

                            {experience.map((exp, index) => (
                                <Box
                                    key={exp.id || index}
                                    sx={{
                                        mb: 3,
                                        pl: 2,
                                        borderLeft: "2px solid",
                                        borderColor: colorScheme.accent,
                                    }}
                                >
                                    <Grid container>
                                        <Grid item xs={12} sm={8}>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 600, color: colorScheme.secondary }}
                                            >
                                                {exp.position || "Position Title"}
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                {exp.company || "Company Name"}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            sx={{ textAlign: { sm: "right" } }}
                                        >
                                            {exp.location && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {exp.location}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(exp.startDate) || "Start Date"} -{" "}
                                                {exp.current
                                                    ? "Present"
                                                    : formatDate(exp.endDate) || "End Date"}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {exp.description && (
                                        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                                            {exp.description}
                                        </Typography>
                                    )}

                                    {Array.isArray(exp.responsibilities) &&
                                        exp.responsibilities.filter(Boolean).length > 0 && (
                                            <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                                                {exp.responsibilities.filter(Boolean).map(
                                                    (responsibility, index) =>
                                                        responsibility.trim() && (
                                                            <Typography
                                                                component="li"
                                                                variant="body2"
                                                                key={index}
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                {responsibility}
                                                            </Typography>
                                                        )
                                                )}
                                            </Box>
                                        )}
                                </Box>
                            ))}
                        </Box>
                    )}

                    {!isSectionEmpty("projects") && (
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontWeight: 600,
                                        color: colorScheme.primary,
                                        display: "flex",
                                        alignItems: "center",
                                        "&::after": {
                                            content: '""',
                                            flexGrow: 1,
                                            height: "2px",
                                            bgcolor: colorScheme.accent,
                                            ml: 2,
                                        },
                                    }}
                                >
                                    Projects
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => toggleStarSection("projects")}
                                    sx={{ ml: 1 }}
                                >
                                    {starredSections.includes("projects") ? (
                                        <StarIcon
                                            fontSize="small"
                                            sx={{ color: colorScheme.primary }}
                                        />
                                    ) : (
                                        <StarBorderIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </Box>

                            {projects.map((project, index) => (
                                <Box
                                    key={project.id || index}
                                    sx={{
                                        mb: 3,
                                        pl: 2,
                                        borderLeft: "2px solid",
                                        borderColor: colorScheme.accent,
                                    }}
                                >
                                    <Grid container>
                                        <Grid item xs={12} sm={8}>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 600, color: colorScheme.secondary }}
                                            >
                                                {project.title || "Project Title"}
                                                {project.link && (
                                                    <Link
                                                        href={project.link}
                                                        target="_blank"
                                                        underline="hover"
                                                        sx={{
                                                            ml: 1,
                                                            fontSize: "0.8rem",
                                                            color: colorScheme.primary,
                                                        }}
                                                    >
                                                        View Project
                                                    </Link>
                                                )}
                                            </Typography>
                                            {project.technologies && (
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ fontStyle: "italic", mt: 0.5 }}
                                                >
                                                    {project.technologies}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            sx={{ textAlign: { sm: "right" } }}
                                        >
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(project.startDate) || "Start Date"} -{" "}
                                                {project.current
                                                    ? "Present"
                                                    : formatDate(project.endDate) || "End Date"}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {project.description && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {project.description}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Grid>

                <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
                    <Box
                        sx={{
                            bgcolor: colorScheme.accent,
                            p: 3,
                            borderRadius: 2,
                            height: "100%",
                        }}
                    >
                        {!isSectionEmpty("education") && (
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            fontWeight: 600,
                                            color: colorScheme.primary,
                                        }}
                                    >
                                        Education
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => toggleStarSection("education")}
                                        sx={{ ml: 1 }}
                                    >
                                        {starredSections.includes("education") ? (
                                            <StarIcon
                                                fontSize="small"
                                                sx={{ color: colorScheme.primary }}
                                            />
                                        ) : (
                                            <StarBorderIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                </Box>

                                {education.map((edu, index) => (
                                    <Box key={edu.id || index} sx={{ mb: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: colorScheme.secondary,
                                                fontSize: "1rem",
                                            }}
                                        >
                                            {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                            {edu.institution || "Institution Name"}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mt: 0.5,
                                            }}
                                        >
                                            {edu.location && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {edu.location}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(edu.startDate) || "Start Date"} -{" "}
                                                {formatDate(edu.endDate) || "End Date"}
                                            </Typography>
                                        </Box>
                                        {edu.description && (
                                            <Typography
                                                variant="body2"
                                                sx={{ mt: 1, fontSize: "0.875rem" }}
                                            >
                                                {edu.description}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {!isSectionEmpty("skills") && (
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            fontWeight: 600,
                                            color: colorScheme.primary,
                                        }}
                                    >
                                        Skills
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => toggleStarSection("skills")}
                                        sx={{ ml: 1 }}
                                    >
                                        {starredSections.includes("skills") ? (
                                            <StarIcon
                                                fontSize="small"
                                                sx={{ color: colorScheme.primary }}
                                            />
                                        ) : (
                                            <StarBorderIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                </Box>

                                <Stack spacing={2}>
                                    {skills.map((category, index) => (
                                        <Box key={category.id || index}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: colorScheme.secondary,
                                                    mb: 1,
                                                }}
                                            >
                                                {category.name || "Skill Category"}
                                            </Typography>

                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                {Array.isArray(category.skills) &&
                                                    category.skills.map((skill, idx) =>
                                                        skill.trim() ? (
                                                            <Chip
                                                                key={idx}
                                                                label={skill.trim()}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: "white",
                                                                    color: colorScheme.secondary,
                                                                    borderColor: colorScheme.primary,
                                                                    "&:hover": {
                                                                        bgcolor: colorScheme.primary,
                                                                        color: "white",
                                                                    },
                                                                }}
                                                            />
                                                        ) : null
                                                    )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ModernTemplate;
